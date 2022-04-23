import { DLS } from "./DLS";
import { Problem } from "./Common/Problem/Types/Problem";
import { Action } from "./Common/Problem/Types/Action";
import { SolutionAndLog } from "./Common/Problem/Types/ResultAndLog";

const _ID_SEARCH = ( problem: Problem ) : SolutionAndLog | undefined  => {

    let result: SolutionAndLog | false | null = null;
    for( let limit=0; true; limit++ ) {
        result = DLS( problem, limit );

        if( !!result )
            return result;
    }
}

export const ID = ( problem: Problem ) => {
    return new Promise<SolutionAndLog | false>( (resolve, reject) => {
        const result = _ID_SEARCH( problem );
        if( !!result )
            resolve( result );
        else
            reject( result );
    } )
}