export const checkPromotionEligibility = (fundraiser) => {

    const score = fundraiser.final_score || 0;
    const confirmations = fundraiser.confirmations || 0;
    const wallet = fundraiser.promo_wallet || 0;

    const scoreThreshold = fundraiser.promotion_threshold_score || 7;
    const confirmationThreshold = fundraiser.promotion_threshold_confirmations || 5;
    const walletThreshold = fundraiser.promotion_threshold_wallet || 200;

    if (
        score >= scoreThreshold &&
        confirmations >= confirmationThreshold &&
        wallet >= walletThreshold
    ) {
        return {
            eligible: true,
            reason: "eligible"
        };
    }

    return {
        eligible: false,
        reason: "insufficient score / confirmations / wallet"
    };
};