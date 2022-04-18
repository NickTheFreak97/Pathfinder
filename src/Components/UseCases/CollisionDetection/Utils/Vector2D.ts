import { Segment } from "../../InputPolygon/Common/Geometry";
import Big from "big.js";

export class Vector2D {

    private x: Big;
    private y :Big;
    private applicationPt?: Vector2D;

    constructor( x: number | Big, y: number | Big, applicationPt?: Vector2D ) {
        this.x = new Big(x);
        this.y = new Big(y);
        this.applicationPt = applicationPt;
    }

    public normalize = (): Vector2D | null => {

        if( this.x.eq(0) && this.y.eq(0) )
            return null;
        else {
            const len: Big =  this.x.mul(this.x).add( this.y.mul(this.y) ).sqrt();
            return new Vector2D( this.x.div(this.length()), this.y.div(this.length()), this.applicationPt );
        }
        
    }

    public normal = (): Vector2D | null => {
        if( this.x === this.y )
            return null;
        else 
            return new Vector2D(this.y, -this.x, new Vector2D(0,0));
    }

    public projectOnto = (onto: Vector2D): Big => {
        return this.x.mul(onto.x).add(this.y.mul(onto.y));
    }

    public length = (): Big => {
        return this.x.mul( this.x ).add( this.y.mul(this.y) ).sqrt();
    }

    public compare = (compareWith: Vector2D): boolean => {
        const tollerance: number = Math.sqrt(Number.EPSILON);
        return this.x.sub(compareWith.x).abs().lte(tollerance) && 
                this.y.sub(compareWith.y).abs().lte(tollerance);
    }

    public toString = (): string => {
        return `{x: ${this.x.toString()}, y: ${this.y.toString()} }`
    }

    public getApplicationPt = (): Vector2D | undefined => {
        return this.applicationPt;
    }

}

export const segmentToV2D = ( segment: Segment ): Vector2D => {
    return new Vector2D( segment[1][0]-segment[0][0], segment[1][1] - segment[0][1], new Vector2D(segment[0][0], segment[0][1], new Vector2D(0, 0)) );
}