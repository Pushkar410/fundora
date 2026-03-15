export const calculateTrustScore = (fundraiser) => {

    const ai = fundraiser.ai_score || 0;
    const doc = fundraiser.doc_score || 0;
    const community = fundraiser.community_score || 0;

    return ai + doc + community;

};