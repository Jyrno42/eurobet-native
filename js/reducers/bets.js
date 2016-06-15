/**
 * @flow
 */


export type BetData = {
    name: string;
    score: number;
};

export type BetsState = {
    byId: Array<string>;
    allBets: ?{[id: string]: BetData};
    isLoading: boolean;
};


const BetsInitialState: BetsState = {
    byId: [],
    allBets: null,
    isLoading: true
};


export function getAllBets(bets) {
    return bets.byId.map(key => bets.allBets[key]);
}


export default function bets(state = BetsInitialState, action) {
    switch(action.type) {
        case 'LOAD_BETS_START':
            return {
                ...state,
                isLoading: true
            };

        case 'LOAD_BETS_FAILED':
            return {
                ...state,
                isLoading: false
            };

        case 'LOAD_BETS_COMPLETED':
            // No merge needed right now...
            const byId = action.data.byId;
            const allBets = action.data.allBets;

            return {
                byId: byId,
                allBets: allBets,
                isLoading: false
            };

        default:
            return state;
    }
}
