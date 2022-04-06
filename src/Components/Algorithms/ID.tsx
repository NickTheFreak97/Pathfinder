import { DLS } from "./DLS";
import { Problem } from "./Common/Problem/Types/Problem";
import { Action } from "./Common/Problem/Types/Action";

const _ID_SEARCH = ( problem: Problem ) : Action[] => {

    let result: Action[] | false | null = null;
    for( let limit=0; true; limit++ ) {
        result = DLS( problem, limit );

        if( !!result )
            return result;
    }

}

export const ID = ( problem: Problem ) => {
    return new Promise<Action[] | false>( (resolve, reject) => {
        const result = _ID_SEARCH( problem );
        if( !!result )
            resolve( result );
        else
            reject( result );
    } )
}