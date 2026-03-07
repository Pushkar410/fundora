import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function Fundraiser() {
    const { id } = useParams();
    const [fundraiser, setFundraiser] = useState(null);

    const loadFundraiser = async () => {
        const docRef = doc(db, "fundraisers", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setFundraiser(docSnap.data());
        }
    };

    useEffect(() => {
        loadFundraiser();
    }, []);

    if (!fundraiser) return <p>Loading...</p>;

    return (
        <div>
            <h1>{fundraiser.name}</h1>

            <p>{fundraiser.story}</p>

            <h3>Goal: ₹{fundraiser.goal}</h3>

            <h3>Raised: ₹{fundraiser.total_raised}</h3>

            <button>Donate</button>
        </div>
    );
}

export default Fundraiser;