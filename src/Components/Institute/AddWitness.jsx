import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import { EdubukContexts } from "../../Context/EdubukContext";
import SmallLoader from "../SmallLoader/SmallLoader";

const AddWitness = () => {
  const [instWitnessAdd, setInstWitnessAdd] = useState("");
  const [loading, setLoading] = useState();
  const { connectingWithContract,account} = useContext(EdubukContexts);
  const [txHash, setTxHash] = useState(null);

  const addWitness = async (e) => {
    e.preventDefault();
    if(!account)
    {
      return toast.error("Please connect your wallet.")
    }
    try {
      setLoading(true);
      const contract = await connectingWithContract();
      const tx= await contract.revokeInstitute(instWitnessAdd);
      await tx.wait();
      if(tx?.hash)
      {
        setLoading(false);
        setTxHash(tx?.hash);
        toast.success("Institute witness added Successfully");
      }
      setInstWitnessAdd("");
    } catch (error) {
      toast.error("Error in Institute Revoke", error);
      console.error("Error in Institute Revoke: ", error);
      setLoading(false);
    }
  };
  return (
    <div className="form-container">
      <form onSubmit={addWitness}>
        <h2>Add Institute Witness</h2>
        <div className="input-box">
          <input
            type="text"
            required
            placeholder="Institute Witness Address"
            value={instWitnessAdd}
            onChange={(e) => setInstWitnessAdd(e.target.value)}
          ></input>
          <label htmlFor="name">Institute Witness Address</label>
        </div>
        {loading === true ? (
          <SmallLoader />
        ) : (
          <div className="multi-btn">
            {" "}
            <button id="register-btn">Add Witness</button>{" "}
            {txHash && (
              <a
                href={`https://testnet.bscscan.com/tx/${txHash}`}
                id="xdc-explorer"
                target="_blank"
                rel="noreferrer"
              >
                View Transaction
              </a>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddWitness;
