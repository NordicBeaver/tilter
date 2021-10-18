import { isBetween } from '../util';
import { substractVectors, Vector2d, vectorLength } from '../vectors';

export interface SphereCollider {
  type: 'sphere';
  position: Vector2d;
  radius: number;
}

export interface BoxCollider {
  type: 'box';
  position: Vector2d;
  width: number;
  height: number;
}

export type Collider = SphereCollider | BoxCollider;

export function detectCollision(sphereCollider1: SphereCollider, sphereCollider2: SphereCollider): Vector2d | null;
export function detectCollision(sphereCollider: SphereCollider, boxCollider: BoxCollider): Vector2d | null;
export function detectCollision(collider1: Collider, collider2: Collider): Vector2d | null {
  if (collider1.type === 'sphere' && collider2.type === 'sphere') {
    return detectCollisionSphereSphere(collider1, collider2);
  } else if (collider1.type === 'sphere' && collider2.type === 'box') {
    return detectCollisionSphereBox(collider1, collider2);
  } else {
    throw new Error(`Collision detection for ${collider1.type} and ${collider2.type} not implemented`);
  }
}

function detectCollisionSphereSphere(sphere1: SphereCollider, sphere2: SphereCollider): Vector2d | null {
  const centerToCenter = substractVectors(sphere2.position, sphere1.position);
  const centerToCenterDistance = vectorLength(centerToCenter);
  if (centerToCenterDistance < sphere1.radius + sphere2.radius) {
    const collisionVectorDistance = sphere1.radius + sphere2.radius - centerToCenterDistance;
    const collisionVector: Vector2d = {
      x: (centerToCenter.x / centerToCenterDistance) * collisionVectorDistance,
      y: (centerToCenter.y / centerToCenterDistance) * collisionVectorDistance,
    };
    return collisionVector;
  } else {
    return null;
  }
}

function detectCollisionSphereBox(sphere: SphereCollider, box: BoxCollider): Vector2d | null {
  // First check if any box's corner is inside the sphere.
  const boxCornerCollision = detectCollitionSphereBoxCorner(sphere, box);
  if (boxCornerCollision) {
    return boxCornerCollision;
  }

  // The check the box's sides.
  const boxSideCollision = detectCollisionSphereBoxSides(sphere, box);
  if (boxSideCollision) {
    return boxSideCollision;
  }

  return null;
}

function detectCollitionSphereBoxCorner(sphere: SphereCollider, box: BoxCollider) {
  const boxTopLeftCorner: Vector2d = box.position;
  const boxTopLeftCornerCollision = detectCollisionSpherePoint(sphere, boxTopLeftCorner);
  if (boxTopLeftCornerCollision) {
    return boxTopLeftCornerCollision;
  }

  const boxTopRightCorner: Vector2d = { x: box.position.x + box.width, y: box.position.y };
  const boxTopRightCornerCollision = detectCollisionSpherePoint(sphere, boxTopRightCorner);
  if (boxTopRightCornerCollision) {
    return boxTopRightCornerCollision;
  }

  const boxBottomRigthCorner: Vector2d = { x: box.position.x + box.width, y: box.position.y + box.height };
  const boxBottomRightCornerCollision = detectCollisionSpherePoint(sphere, boxBottomRigthCorner);
  if (boxBottomRightCornerCollision) {
    return boxBottomRightCornerCollision;
  }

  const boxBottomLeftCorner: Vector2d = { x: box.position.x, y: box.position.y + box.height };
  const boxBottomLeftCornerCollision = detectCollisionSpherePoint(sphere, boxBottomLeftCorner);
  if (boxBottomLeftCornerCollision) {
    return boxBottomLeftCornerCollision;
  }

  return null;
}

function detectCollisionSphereBoxSides(sphere: SphereCollider, box: BoxCollider) {
  const sphereTop = sphere.position.y - sphere.radius;
  const sphereBottom = sphere.position.y + sphere.radius;
  const sphereLeft = sphere.position.x - sphere.radius;
  const sphereRight = sphere.position.x + sphere.radius;

  const boxTop = box.position.y;
  const boxBottom = box.position.y + box.height;
  const boxLeft = box.position.x;
  const boxRight = box.position.x + box.width;

  if (isBetween(sphere.position.x, boxLeft, boxRight)) {
    if (isBetween(sphereBottom, boxTop, boxBottom)) {
      // Top side
      const collisionVector: Vector2d = { x: 0, y: sphereBottom - boxTop };
      return collisionVector;
    }
    if (isBetween(sphereTop, boxTop, boxBottom)) {
      // Bottom side
      const collisionVector: Vector2d = { x: 0, y: sphereTop - boxBottom };
      return collisionVector;
    }
  }
  if (isBetween(sphere.position.y, boxTop, boxBottom)) {
    if (isBetween(sphereRight, boxLeft, boxRight)) {
      // Left side
      const collisionVector: Vector2d = { x: sphereRight - boxLeft, y: 0 };
      return collisionVector;
    }
    if (isBetween(sphereLeft, boxLeft, boxRight)) {
      // Right side
      const collisionVector: Vector2d = { x: sphereLeft - boxRight, y: 0 };
      return collisionVector;
    }
  }
}

function detectCollisionSpherePoint(sphere: SphereCollider, point: Vector2d): Vector2d | null {
  if (inSphere(point, sphere)) {
    // Collision vector is how deep the point is inside the sphere.
    // So it's bigger the closer the point is to the center.
    const centerToPoint = substractVectors(point, sphere.position);
    const centerToPointDistance = vectorLength(centerToPoint);
    const collisionVectorDistance = sphere.radius - centerToPointDistance;
    const collisionVector: Vector2d = {
      x: (centerToPoint.x / centerToPointDistance) * collisionVectorDistance,
      y: (centerToPoint.y / centerToPointDistance) * collisionVectorDistance,
    };
    return collisionVector;
  } else {
    return null;
  }
}

function inSphere(point: Vector2d, sphere: SphereCollider) {
  const sphereCenterToPoint = substractVectors(point, sphere.position);
  const sphereCenterToPointDistance = vectorLength(sphereCenterToPoint);
  return sphereCenterToPointDistance < sphere.radius;
}
