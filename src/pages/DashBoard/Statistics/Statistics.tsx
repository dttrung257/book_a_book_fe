import { useCallback, useEffect, useState } from "react";
import { getStats } from "../../../apis/manage";
import { useAppSelector } from "../../../store/hook";
import style from "./Statistics.module.css";
import { GiReceiveMoney } from "react-icons/gi";
import { ImBook } from "react-icons/im";
import { BsCartCheckFill } from "react-icons/bs";
import { PieChart, Pie, Tooltip, AreaChart, Area, CartesianGrid, YAxis, XAxis, Sector } from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Statistics = () => {
	const accessToken = useAppSelector((state) => state.auth.accessToken);
	const [startDate, setStartDate] = useState<Date>(new Date());
	const [revenue, setRevenue] = useState<number>(0);
	const [revenueTrend, setRevenueTrend] = useState<number[]>([]);
	// const [showAll, setShowAll] = useState(false);
	const [orderCount, setOrderCount] = useState<{
		canceledOrders: number,
		pendingOrders: number,
		shippingOrders: number,
		successfulOrders: number,
		total: number
	}>({
		canceledOrders: 0,
		pendingOrders: 0,
		shippingOrders: 0,
		successfulOrders: 0,
		total: 0
	});
	const [booksSold, setBooksSold] = useState<number>(0);
	const [activeIndex, setActiveIndex] = useState(0);
	const onPieEnter = useCallback(
		(_: any, index: number) => {
			setActiveIndex(index);
		},
		[setActiveIndex]
	);

	useEffect(() => {
		// if (showAll) {
		// 	getStats({
		// 		headers: {
		// 			Authorization: `Bearer ${accessToken}`,
		// 		},
		// 	}).then(data => {
		// 		setRevenue(data[0].revenue);
		// 		setBooksSold(data[0].booksSold);
		// 		setOrderCount({
		// 			canceledOrders: data[0].canceledOrders,
		// 			pendingOrders: data[0].pendingOrders,
		// 			shippingOrders: data[0].shippingOrders,
		// 			successfulOrders: data[0].successfulOrders,
		// 			total: data[0].canceledOrders + data[0].pendingOrders + data[0].shippingOrders + data[0].successfulOrders
		// 		})
		// 	}).catch(err => {
		// 		console.log(err)
		// 	})
		// } else {
		getStats({
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}, 1, startDate.getFullYear(), startDate.getMonth() + 1).then(data => {
			setRevenue(data[startDate.getMonth()].revenue);
			setBooksSold(data[startDate.getMonth()].booksSold);
			setOrderCount({
				canceledOrders: data[startDate.getMonth()].canceledOrders,
				pendingOrders: data[startDate.getMonth()].pendingOrders,
				shippingOrders: data[startDate.getMonth()].shippingOrders,
				successfulOrders: data[startDate.getMonth()].successfulOrders,
				total: data[startDate.getMonth()].canceledOrders + data[startDate.getMonth()].pendingOrders + data[startDate.getMonth()].shippingOrders + data[startDate.getMonth()].successfulOrders
			})
			let tmp = [];
			for (let i = 0; i <= startDate.getMonth(); i++) {
				tmp.push(data[i].revenue);
			}
			setRevenueTrend(tmp);
		}).catch(err => {
			console.log(err)
		})
		// }
	}, [startDate]);

	const orderListConvertToArray = [
		{
			"name": "Canceled Orders",
			"value": orderCount.canceledOrders
		},
		{
			"name": "Pending Orders",
			"value": orderCount.pendingOrders
		},
		{
			"name": "Shipping Orders",
			"value": orderCount.shippingOrders
		},
		{
			"name": "Successful Orders",
			"value": orderCount.successfulOrders
		}
	];

	const revenueAnalytic = () => {
		let tmp: any[] = [];
		if (startDate) {
			for (let i = 0; i <= startDate?.getMonth(); i++) {
				tmp.push({
					"revenue": revenueTrend[i],
					"time": `${i + 1}/${startDate.getFullYear()}`
				})
			}
		}
		return tmp;
	}

	const renderActiveShape = (props: any) => {
		const RADIAN = Math.PI / 180;
		const {
			cx,
			cy,
			midAngle,
			innerRadius,
			outerRadius,
			startAngle,
			endAngle,
			fill,
			payload,
			percent,
			value
		} = props;
		const sin = Math.sin(-RADIAN * midAngle);
		const cos = Math.cos(-RADIAN * midAngle);
		const sx = cx + (outerRadius + 10) * cos;
		const sy = cy + (outerRadius + 10) * sin;
		const mx = cx + (outerRadius + 30) * cos;
		const my = cy + (outerRadius + 30) * sin;
		const ex = mx + (cos >= 0 ? 1 : -1) * 22;
		const ey = my;
		const textAnchor = cos >= 0 ? "start" : "end";

		return (
			<g>
				<text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
					{payload.name}
				</text>
				<Sector
					cx={cx}
					cy={cy}
					innerRadius={innerRadius}
					outerRadius={outerRadius}
					startAngle={startAngle}
					endAngle={endAngle}
					fill={fill}
				/>
				<Sector
					cx={cx}
					cy={cy}
					startAngle={startAngle}
					endAngle={endAngle}
					innerRadius={outerRadius + 6}
					outerRadius={outerRadius + 10}
					fill={fill}
				/>
				<path
					d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
					stroke={fill}
					fill="none"
				/>
				<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
				<text
					x={ex + (cos >= 0 ? 1 : -1) * 12}
					y={ey}
					textAnchor={textAnchor}
					fill="#333"
				>{`${value}`}</text>
				<text
					x={ex + (cos >= 0 ? 1 : -1) * 12}
					y={ey}
					dy={18}
					textAnchor={textAnchor}
					fill="#999"
				>
					{`${(percent * 100).toFixed(2)}%`}
				</text>
			</g>
		);
	};

	return (
		<div>
			<h2>Statistics</h2>

			<DatePicker
				selected={startDate}
				onChange={(date) => setStartDate(date ? date : new Date())}
				dateFormat="MM/yyyy"
				showMonthYearPicker
				showFullMonthYearPicker
				className={style.datePicker}
			/>

			{/* <button className={style.showAll} onClick={() => setShowAll(true)}>Show All</button> */}
			<div id={style.privacyFooter}>
				<div className={style.privacyFooterInner}>
					<span className={style.iconPr}>
						<GiReceiveMoney fontSize={30} />
					</span>
					<p>
						Revenue
						<br />
						<span>${revenue}</span>
					</p>
				</div>
				<div
					className={style.privacyFooterInner}
				>
					<span className={style.iconPr}>
						<BsCartCheckFill fontSize={30} />
					</span>
					<p>
						Total orders
						<br />
						<span>{orderCount.total}</span>
					</p>
				</div>
				<div className={style.privacyFooterInner}>
					<span className={style.iconPr}>
						<ImBook fontSize={30} />
					</span>
					<p>
						Books sold
						<br />
						<span>{booksSold}</span>
					</p>
				</div>
			</div>

			<div className={style.contChart}>
				<div className={style.chart}>
					<p>Line Chart Showing Monthly Revenue Trend Of This Year</p>
					<AreaChart
						width={450}
						height={300}
						data={revenueAnalytic()}
						margin={{
							top: 30,
							right: 30,
							left: 0,
							bottom: 0
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="time" />
						<YAxis />
						<Tooltip />
						<Area type="monotone" dataKey="revenue" stroke="#008b8b" fill="#1ecdcd" />
					</AreaChart></div>
				<div className={style.chart}>
					<p>Pipe Chart Showing Order Ratio Of This Month</p>

					<PieChart width={450} height={400}>
						<Pie
							activeIndex={activeIndex}
							activeShape={renderActiveShape}
							data={orderListConvertToArray}
							cx={200}
							cy={150}
							innerRadius={70}
							outerRadius={90}
							fill="#008b8b"
							dataKey="value"
							onMouseEnter={onPieEnter}
						/>
					</PieChart>
				</div>
			</div>
		</div>
	);
}

export default Statistics;