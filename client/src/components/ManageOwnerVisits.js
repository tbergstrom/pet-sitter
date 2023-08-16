import { useContext, useState } from "react";
import VisitTable from "./VisitTable";
import AuthContext from "../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const ManageOwnerVisits = ()=> {

    const [visits, setVisits] = useState([]);
    const [visitsCounter, setVisitsCounter] = useState(visits.length);
    
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const params = useParams();

    const loadVisits = ()=> {
        console.log("implement loadVisits function");
    }

    return (
        <>
            <VisitTable />
        </>
    )
}

export default ManageOwnerVisits;