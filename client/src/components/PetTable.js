import PetDetails from './PetDetails'
import ConfirmPetDelete from './ConfirmPetDelete'
import { useEffect } from 'react'

const PetTable = (props)=> {
    console.log(props.pets)

// Direct child of ManagePets
// Parent of PetDetails, ConfirmPetDelete

// An owners pets live here in a table
// The table will link to ConfirmPetDelete, PetDetails

    useEffect(props.loadPets, [])

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>&nbsp;</th>
                </tr>
            </thead>
            <tbody>
                {props.pets && props.pets.length > 0 && 
                props.pets.map(pet => (
                    <tr key={pet.petId}>
                        <td>{pet.name}</td>
                        <td>{pet.petType}</td>
                        <td>{<PetDetails />}</td>
                        <td>{<ConfirmPetDelete />}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default PetTable;