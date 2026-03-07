import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import FundraiserCard from "../components/FundraiserCard";

function Home() {
    const [fundraisers, setFundraisers] = useState([]);

    const loadFundraisers = async () => {
        const querySnapshot = await getDocs(collection(db, "fundraisers"));

        const list = [];

        querySnapshot.forEach((doc) => {
            list.push({
                id: doc.id,
                ...doc.data()
            });
        });

        setFundraisers(list);
    };

    useEffect(() => {
        loadFundraisers();
    }, []);

    return (
        <div>
            <h1>Fundraisers</h1>

            {fundraisers.map((f) => (
                <FundraiserCard key={f.id} fundraiser={f} />
            ))}
        </div>
    );
}

export default Home;