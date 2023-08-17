import { useState } from "react";
import PetForm from "./PetForm";
import PetTable from "./PetTable";

const ManagePets = ()=> {

    const [pets, setPets] = useState([]);

// Direct child of ManageAccount
// Parent of PetTable, PetForm

// You can see your pets here via PetTable
// and add new ones via PetForm

    return (
        <>
            <PetForm pets={pets} setPets={setPets}/>
            <PetTable pets={pets}/>
        </>
    )
}

export default ManagePets;