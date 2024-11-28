import {useEffect, useState} from "react";

function TransactionPage() {
    const [transactions, setTransactions] = useState([]);

    const fetchTransactions = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:8080/api/v1/transaction/userTransactions", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error(error.message);
        }
    }

    const formatDate = (date) => {
        if (!date) return 'Invalid date';
        const match = date.match(/^\d{4}-\d{2}-\d{2}/);
        return match ? match[0] : 'Invalid date';
    }

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div className="container">
            <table className="table table-bordered text-center">
                <thead className="table-dark align-middle">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Transaction Id</th>
                    <th scope="col">Sold Currency Name</th>
                    <th scope="col">Sold Currency Amount</th>
                    <th scope="col">Bought Currency Name</th>
                    <th scope="col">Bought Currency Amount</th>
                    <th scope="col">Date</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((transaction, index) => (
                    <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>#{transaction.id}</td>
                        <td>{transaction.sellCurrency}</td>
                        <td>{transaction.sellAmount}</td>
                        <td>{transaction.buyCurrency}</td>
                        <td>{transaction.buyAmount}</td>
                        <td>{formatDate(transaction.date)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
export default TransactionPage;