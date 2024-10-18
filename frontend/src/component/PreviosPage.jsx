import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const products = [
    {
        id: 1,
        title: 'Brand Name 1',
        description: 'Adidas is a global leader in the sporting goods industry, offering a wide range of footwear, apparel, and equipment. With a commitment to innovation and performance, Adidas designs products that cater to athletes of all levels, providing the perfect blend of style and functionality.',
        amount: 9999,
        image: 'https://s3.amazonaws.com/cdn.designcrowd.com/blog/100-Famous-Brand%20Logos-From-The-Most-Valuable-Companies-of-2020/Adidas.png',
    },
    {
        id: 2,
        title: 'Brand Name 2',
        description: 'Pepsi is a renowned carbonated soft drink brand that has been refreshing consumers worldwide since 1893. Known for its bold taste and vibrant marketing campaigns, Pepsi is a favorite among those looking for a flavorful and energizing beverage. With a diverse product range, including sugar-free and diet options, Pepsi continues to innovate and connect with consumers across generations.',
        amount: 259357,
        image: 'https://www.hubspot.com/hs-fs/hubfs/Pepsi_logo_2014.svg.png?width=450&height=458&name=Pepsi_logo_2014.svg.png',
    },
    {
        id: 3,
        title: 'Brand Name 3',
        description: 'Chanel is a luxury fashion brand that epitomizes elegance and sophistication. Founded by Coco Chanel in 1910, the brand is renowned for its haute couture, ready-to-wear fashion, accessories, and fragrances. Chanel is celebrated for its timeless designs, including the iconic Chanel No. 5 perfume and the classic Chanel suit. The brand continues to set trends and inspire fashion enthusiasts around the world.',
        amount: 9658932,
        image: 'https://mbluxury1.s3.amazonaws.com/2022/02/25172616/chanel-1.jpg',
    },
];


const PreviousPage = () => {
    const [selectedProduct, setSelectedProduct] = useState(products[0]);
    const [URL, setURL] = useState('');
    console.log(URL)
    // const handleProductChange = (e) => {
    //     const productId = parseInt(e.target.value);
    //     const product = products.find((p) => p.id === productId);
    //     setSelectedProduct(product);
    // };
    const navigate = useNavigate();

    const handlePayment = async () => {
        try {
            const response = await fetch('http://localhost:5000/create-payment-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedProduct),
            });

            // Check if response is OK (status 200-299)
            if (response.ok) {
                const data = await response.json();

                // Check if the session ID is present in the response and redirect
                if (data.url) {
                    // Extract session ID from the URL
                    const sessionId = data.url.split('/').pop(); // Get the last part of the URL
                    // navigate(`/payment/${sessionId}`); // Navigate to the payment page with the session ID
                    setURL(data.url)
                } else {
                    console.log('Payment URL not found in the response');
                }
            } else {
                console.error('Request failed with status:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleCopy = () => {
        navigator.clipboard.writeText(URL);
    };

    const handleRedirect = () => {
        window.open(URL, '_blank');
    };
    return (
        <>
            {URL && (
                <div className="flex justify-center items-center my-5 space-x-4">
                    <h3 className="text-xl font-bold text-center">
                        {URL}
                    </h3>
                    {/* Copy Icon as Image */}
                    <button onClick={handleCopy} className="hover:opacity-75">
                        <img
                            src="https://w7.pngwing.com/pngs/592/864/png-transparent-computer-icons-icon-design-cut-copy-and-paste-taobao-clothing-promotional-copy-text-rectangle-emoticon-thumbnail.png"  // Provide the path to your copy image
                            alt="Copy"
                            className="w-6 h-6"
                        />
                    </button>
                    {/* Go to Page Icon as Image */}
                    <button onClick={handleRedirect} className="hover:opacity-75">
                        <img
                            src="https://w7.pngwing.com/pngs/808/964/png-transparent-right-arrow-arrow-rotation-curve-curved-arrow-tool-angle-text-monochrome-thumbnail.png"  // Provide the path to your go-to-page image
                            alt="Go"
                            className="w-6 h-6"
                        />
                    </button>
                </div>
            )}

            <div className="max-w-4xl mx-auto mt-10 border p-5 rounded-xl bg-white shadow-lg">
                <h2 className="text-4xl underline font-bold mb-8 text-center text-gray-800">
                    Enter Product Details
                </h2>

                {/* Product Title and Description */}
                <div className="mb-6 flex flex-col lg:flex-row gap-6">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Title</label>
                        <input
                            id="productTitle"
                            type="text"
                            placeholder="Enter product title"
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
                        <input
                            id="productDesc"
                            type="text"
                            placeholder="Enter product description"
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                </div>

                {/* Product Amount and Image */}
                <div className="mb-6 flex flex-col lg:flex-row gap-6">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Amount</label>
                        <input
                            id="productAmount"
                            type="number"
                            placeholder="Enter product amount"
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                        <input
                            id="productImg"
                            type="file"
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                </div>

                {/* Agent Details */}
                <div className="mb-6 flex flex-col lg:flex-row gap-6">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Agent Name</label>
                        <input
                            id="agentName"
                            type="text"
                            placeholder="Enter agent's name"
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Agent Number</label>
                        <input
                            id="agentNum"
                            type="number"
                            placeholder="Enter agent's contact number"
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Agent Email</label>
                    <input
                        id="agentEmail"
                        type="email"
                        placeholder="Enter agent's email"
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />
                </div>

                <button
                    onClick={handlePayment}
                    className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-md hover:bg-green-700 transition duration-300 ease-in-out disabled:bg-gray-400"
                    disabled={!selectedProduct}
                >
                    Process
                </button>
            </div>


        </>

    );
};

export default PreviousPage;
