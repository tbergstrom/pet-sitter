const SitterTable = ()=> {

// Direct child of FindSitter
// Parent of SitterDetails

// SitterDetails is accessible through a button by each sitter in the table of results
// SitterSearchBar will populate Sitter results here

// Try to show 3 cards for 3 closest sitters
// Then show a normal table for sitters sorted by distance

    // Fake sitters
    const testSitter1 = {
        appUserId: 1,
        username: "Aa",
        contactInfoId: 1,
        rate: 40.00,
        petTypes: ["Dog", "cat"]
    };

    const testSitter2 = {
        appUserId: 2,
        username: "Bb",
        contactInfoId: 2,
        rate: 45.00,
        petTypes: ["Turtle", "cat"]
    };

    const testSitter3 = {
        appUserId: 3,
        username: "Cc",
        contactInfoId: 3,
        rate: 50.00,
        petTypes: ["Dog", "bird"]
    };

    const testSitter4 = {
        appUserId: 4,
        username: "Dd",
        contactInfoId: 4,
        rate: 50.00,
        petTypes: ["Pig", "cat"]
    };

    const testSitter5 = {
        appUserId: 5,
        username: "Ee",
        contactInfoId: 5,
        rate: 55.00,
        petTypes: ["Dog", "pig"]
    };

    const testSitter6 = {
        appUserId: 56,
        username: "Ff",
        contactInfoId: 6,
        rate: 60.00,
        petTypes: ["Snake", "mouse"]
    };

    // Fake array of sitters. This will be replaced by an array from our Fetch API request
    const testSitters = [testSitter1, testSitter2, testSitter3, testSitter4, testSitter5, testSitter6];

    const topThree = testSitters.slice(0,3);
    const others = testSitter1.slice(3);

    return (
        <>
            <h3>Sitters Near You</h3>
            <div className="d-flex justify-content-between">
                {topThree.map(sitter => (
                    <div className="card" style={{width: "18rem"}}>
                        {/* Need to have a pfp URL, prob in contact_info table */}
                        <img src={sitter.pfpUrl} className="card-img-top" alt="" />
                        <div className="card-body">
                            <h5 className="card-title">{sitter.username}</h5>
                            <p className="card-text">{sitter.petTypes.join(", ")}</p>
                            <p>Distance: </p>
                            <p><button>Details</button></p>
                        </div>
                    </div>
                ))}
            </div>
            <table className="table">
                    <thead>
                        <tr>
                            <th>Profile</th>
                            <th>Distance</th>
                            <th>Username</th>
                            <th>Pet Types</th>
                            <th>&npsb;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {others.map(sitter => (
                            <tr>
                                <td><img src={sitter.pfpUrl} className="card-img-top" alt="" /></td>
                                <td>x miles away</td>
                                <td>{sitter.username}</td>
                                <td>{sitter.petTypes.join(", ")}</td>
                                {/* Link to Sitter details with contact info, booking, etc */}
                                <td><button>Details</button></td>
                            </tr>
                        ))}
                    </tbody>
            </table>
        </>
    )
}

export default SitterTable;