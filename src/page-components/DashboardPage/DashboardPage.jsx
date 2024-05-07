import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllDonations } from "../../../dummy-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

function DashboardPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewType, setViewType] = useState('donations');  // 'donations' or 'requests'

    const donations = getAllDonations().filter(donation =>
        donation.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = () => {

    };

    const handleToggleView = () => {
        setViewType(viewType === 'donations' ? 'requests' : 'donations');
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-center text-gray-800 my-8">Dashboard</h1>
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="p-2 border border-gray-300 rounded"
                    />
                    <Button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Search
                    </Button>
                    <div
                        onClick={() => { /* logic to handle adding a donation */ }}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                        <Link href="/addItem/page">Add Donation</Link>
                    </div>
                </div>
                <button
                    onClick={handleToggleView}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    Toggle View: {viewType === 'donations' ? 'Requests' : 'Donations'}
                </button>
            </div>
            <div className="grid grid-cols-3 gap-8 m-10">
                {donations.map(donation => (
                    <Card key={donation.id} className="flex flex-col justify-between bg-white rounded-lg shadow-md">
                        <CardHeader className="flex-row gap-4 items-center">
                            <Avatar>
                                <AvatarImage src={`/images/${donation.image}`} alt="Donation Image" />
                                <AvatarFallback>
                                    {donation.title.slice(0,2)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle>{donation.title}</CardTitle>
                                <CardDescription>{donation.donorName}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p>{donation.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button>View Detail</Button>
                            <Badge variant="secondary" className=" px-3 py-1 rounded-full text-sm font-medium">
                                Strong Match 🚀
                            </Badge>

                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default DashboardPage;
