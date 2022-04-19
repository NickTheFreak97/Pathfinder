import { AABB } from "./aabb";
import { Entity } from "./entity";
import { Vector2 } from "./math";
import { PRNG } from "./prng";

export class Box extends Entity
{
    public color: string;
    public width: number;
    public height: number;
    public id?: string;

    constructor(position: Vector2, width: number, height: number, id?: string)
    {
        super();

        this.position = position;
        this.width = width;
        this.height = height;
        this.id = id;

        this.color = uniqueColor(this);
    }
}

export function toBox(aabb: AABB): Box
{
    let size = aabb.max.sub(aabb.min);

    return new Box(aabb.min, size.x, size.y);
}

export function toAABB( box: Box ): AABB {
    return new AABB( box.position, new Vector2(box.position.x+box.width, box.position.y+box.height))
}

const rand = new PRNG(1234);

export function uniqueColor(box: Box): string
{
    rand.setSeed((box.position.x << 16) + (box.position.y << 8) + (box.width << 4) + box.height);
    return rand.nextColor();
}