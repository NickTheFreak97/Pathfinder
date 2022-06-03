import { DLS } from "./DLS";
import { Problem } from "./Common/Problem/Types/Problem";
import { SolutionAndLog } from "./Common/Problem/Types/ResultAndLog";

const _ID_SEARCH = ( problem: Problem, computeEBF?: boolean ) : SolutionAndLog | undefined  => {

    let result: SolutionAndLog | false | null = null;
    for( let limit=0; true; limit++ ) {
        result = DLS( problem, limit, computeEBF );

        if( !!result )
            return result;
    }
}

export const ID = ( problem: Problem, computeEBF?: boolean ) => {
    return new Promise<SolutionAndLog | false>( (resolve, reject) => {
        const result = _ID_SEARCH( problem, computeEBF );

        if( !!result )
            resolve( result );
        else
            reject( result );
    } )
}