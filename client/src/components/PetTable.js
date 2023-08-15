const PetTable = ()=> {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Species</th>
                    <th>Notes</th>
                    <th>&nbsp;</th>
                </tr>
            </thead>
            <tbody>
                {props.pets.map(pet => (
                    <tr key={pet.petId}>
                        <td>{pet.name}</td>
                        <td>{pet.petType}</td>
                        <td>{pet.notes}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default PetTable;