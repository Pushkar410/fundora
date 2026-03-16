export const checkWithdrawalEligibility = (fundraiser) => {

    const raised = fundraiser.total_raised || 0;
    const withdrawn = fundraiser.withdrawn_amount || 0;
    const stage = fundraiser.withdrawal_stage || 0;

    if (stage === 0) {
        return {
            eligible: true,
            amount: raised * 0.2,
            nextStage: 1
        };
    }

    if (stage === 1) {
        return {
            eligible: true,
            amount: raised * 0.3,
            nextStage: 2
        };
    }

    if (stage === 2) {
        return {
            eligible: true,
            amount: raised - withdrawn,
            nextStage: 3
        };
    }

    return {
        eligible: false,
        amount: 0,
        nextStage: stage
    };
};