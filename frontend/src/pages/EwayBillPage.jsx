import React from 'react';
import Footer from '../components/Footer';

const EwayBillPage = () => {
    return (
        <>
            <div>
                {/* Hero Section */}
                <header
                    className="relative bg-cover bg-center text-white py-24 px-4"
                    style={{ backgroundImage: 'url("/Ewaybillimg1.jpg")' }}
                >
                    <div className="mt-10 bg-opacity-60 p-6 rounded-xl max-w-5xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">E-Way Bill Information</h1>
                        <p className="text-lg md:text-xl">
                            Understand the essentials of E-Way Bills and how they impact goods transport under GST.
                        </p>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto py-12 px-4 space-y-12">

                    {/* What is GST? */}
                    <section>
                        <h2 className="text-3xl font-bold mb-6 text-blue-900">What is <span className="text-blue-800">GST</span>?</h2>
                        <p className="mb-4">
                            GST (Goods and Services Tax) is a consumption-based tax, meaning the tax is received by the state where goods or services are consumed, 
                            and not by the state where they are produced or manufactured.
                        </p>
                        <p className="mb-4">
                            When goods move within a state, GST is divided into CGST and SGST. For inter-state movement, IGST is applied.
                        </p>
                        <p className="mb-4 font-medium">
                            <strong>Example:</strong> Selling goods worth ₹1,00,000 in Maharashtra with 18% GST results in ₹9,000 CGST and ₹9,000 SGST. If sold to Karnataka, ₹18,000 IGST applies.
                        </p>

                        <div className="w-full md:w-2/3 lg:w-1/2 mx-auto mt-6">
                            <img
                                src="/Ewaybillimg2"
                                alt="E-Way Bill illustration"
                                className="w-1/2 h-auto rounded-xl shadow-xl transition-transform hover:scale-105 mt-10 mx-auto"
                            />
                        </div>
                    </section>

                    {/* GST Comparison Table */}
                    <section>
                        <h2 className="text-3xl font-bold mb-6 text-blue-900">GST Comparison: CGST vs SGST vs IGST</h2>
                        <div className="overflow-x-auto rounded-lg shadow-md">
                            <table className="min-w-full border text-sm md:text-base text-left border-collapse">
                                <thead>
                                    <tr className="bg-blue-100 text-blue-900">
                                        <th className="p-3 border font-semibold"></th>
                                        <th className="p-3 border font-semibold">CGST</th>
                                        <th className="p-3 border font-semibold">SGST</th>
                                        <th className="p-3 border font-semibold">IGST</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {[
                                        {
                                            label: 'Meaning',
                                            cgst: 'Levied by Central Govt to replace central taxes (e.g., service tax, excise).',
                                            sgst: 'Levied by State Govt to replace state-level taxes (e.g., VAT, entry tax).',
                                            igst: 'A combined tax for inter-state trade, levied by the Central Govt.',
                                        },
                                        {
                                            label: 'Collection of Tax',
                                            cgst: 'Central Government',
                                            sgst: 'State Government',
                                            igst: 'Central Government',
                                        },
                                        {
                                            label: 'Applicability',
                                            cgst: 'Intra-State supply',
                                            sgst: 'Intra-State supply',
                                            igst: 'Inter-State supply',
                                        },
                                        {
                                            label: 'Registration',
                                            cgst: 'Not required until ₹20L (₹10L for NE states)',
                                            sgst: 'Not required until ₹20L (₹10L for NE states)',
                                            igst: 'Mandatory',
                                        },
                                        {
                                            label: 'Composition',
                                            cgst: 'Available up to ₹75L turnover',
                                            sgst: 'Available up to ₹75L turnover',
                                            igst: 'Not applicable',
                                        },
                                    ].map((row, i) => (
                                        <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="p-3 border font-medium">{row.label}</td>
                                            <td className="p-3 border">{row.cgst}</td>
                                            <td className="p-3 border">{row.sgst}</td>
                                            <td className="p-3 border">{row.igst}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* What is an E-Way Bill */}
                    <section>
                        <h2 className="text-3xl font-bold mb-4 text-blue-900">What is an <span className="text-blue-800">E-Way Bill</span>?</h2>
                        <p className="mb-4">
                            An E-Way Bill is a document required for the movement of goods worth more than ₹50,000 under GST. 
                            It ensures tax compliance and helps track goods during transit.
                        </p>
                        <p className="mb-4">
                            It includes details of the consignor, consignee, goods, and transporter. 
                            The bill must be generated through the official GST portal before dispatch.
                        </p>
                        <p className="mb-4 font-medium">
                            <strong>Example:</strong> A factory in Delhi sending goods worth ₹80,000 to Uttar Pradesh must generate an E-Way Bill before dispatch.
                        </p>
                        <p>
                            At <strong>LogiTruck</strong>, we provide awareness to drivers, transporters, and businesses so your goods move smoothly and legally.
                        </p>
                    </section>

                    {/* When is it Required */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-blue-900">When is it Required?</h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-800">
                            <li>When goods in a vehicle exceed ₹50,000 in value.</li>
                            <li>For inter-state movement.</li>
                            <li>For transfer between branches or warehouses.</li>
                        </ul>
                    </section>

                    {/* Who Should Generate It */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-blue-900">Who Should Generate It?</h2>
                        <p>The E-Way Bill must be generated by:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-800 mt-2">
                            <li>Registered supplier or recipient.</li>
                            <li>Transporter, if supplier/recipient doesn't generate it.</li>
                        </ul>
                    </section>

                    {/* How to Generate */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-blue-900">How to Generate?</h2>
                        <p>
                            You can generate the E-Way Bill from the government portal: <br />
                            <a
                                href="https://ewaybillgst.gov.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-700 underline"
                            >
                                ewaybillgst.gov.in
                            </a>
                        </p>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default EwayBillPage;
