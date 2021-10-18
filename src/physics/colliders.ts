import { clamp } from 'lodash';
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
  const boxTop = box.position.y;
  const boxBottom = box.position.y + box.height;
  const boxLeft = box.position.x;
  const boxRight = box.position.x + box.width;

  const nearestBoxPoint: Vector2d = {
    x: clamp(sphere.position.x, boxLeft, boxRight),
    y: clamp(sphere.position.y, boxTop, boxBottom),
  };
  const nearestBoxPointToSphere = substractVectors(sphere.position, nearestBoxPoint);
  const nearestBoxPointToSphereDistance = vectorLength(nearestBoxPointToSphere);
  if (nearestBoxPointToSphereDistance < sphere.radius) {
    const collisionVectorDistance = sphere.radius - nearestBoxPointToSphereDistance;
    const collisionVector: Vector2d = {
      x: -(nearestBoxPointToSphere.x / nearestBoxPointToSphereDistance) * collisionVectorDistance,
      y: -(nearestBoxPointToSphere.y / nearestBoxPointToSphereDistance) * collisionVectorDistance,
    };
    return collisionVector;
  } else {
    return null;
  }
}
