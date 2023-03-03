import React from "react";

import "./shopCard.css";

const ShopCard = (data) => {
	const vpUrl =
		"https://media.valorant-api.com/currencies/85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741/displayicon.png";
	const now = new Date();
	const expireDate = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate() + 1,
		5,
		0,
		0,
		0
	);
	console.log(expireDate);

	let localStorageData = {
		item1: data.item1,
		item2: data.item2,
		item3: data.item3,
		item4: data.item4,
		price1: data.price1,
		price2: data.price2,
		price3: data.price3,
		price4: data.price4,
		img1: data.img1,
		img2: data.img2,
		img3: data.img3,
		img4: data.img4,
		expireDate: expireDate,
	};
	localStorage.setItem("LastStoreData", JSON.stringify(localStorageData));

	const storeData = JSON.parse(localStorage.getItem("LastStoreData"));
	console.log(storeData);

	return (
		<div className="mainDiv" id="shop">
			<div className="shopItem" id="item1">
				<img src={data.img1} alt={data.item1} className="itemImg1" />
				<span className="itemName1">{data.item1}</span>
				<div className="itemPriceContainer">
					<img src={vpUrl} alt="vp" className="vp" />
					<span id="itemPrice1" className="itemPrice">
						{data.price1}
					</span>
				</div>
			</div>
			<div className="shopItem" id="item2">
				<img src={data.img2} alt={data.item2} className="itemImg2" />
				<span className="itemName2">{data.item2}</span>
				<div className="itemPriceContainer">
					<img src={vpUrl} alt="" className="vp" />
					<span id="itemPrice2" className="itemPrice">
						{data.price2}
					</span>
				</div>
			</div>
			<div className="shopItem" id="item3">
				<img src={data.img3} alt={data.item3} className="itemImg3" />
				<span className="itemName3">{data.item3}</span>
				<div className="itemPriceContainer">
					<img src={vpUrl} alt="vp" className="vp" />
					<span id="itemPrice3" className="itemPrice">
						{data.price3}
					</span>
				</div>
			</div>
			<div className="shopItem" id="item4">
				<img src={data.img4} alt={data.item4} className="itemImg4" />
				<span className="itemName4">{data.item4}</span>
				<div className="itemPriceContainer">
					<img src={vpUrl} alt="vp" className="vp" />
					<span id="itemPrice4" className="itemPrice">
						{data.price4}
					</span>
				</div>
			</div>
		</div>
	);
};

export default ShopCard;
