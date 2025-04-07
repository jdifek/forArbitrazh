import { Droplets, ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { FaHryvniaSign } from "react-icons/fa6";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CurrentDailyStats } from "../api/Stats/StatsTypes";
import { useAuth } from "../helpers/context/AuthContext";

const Dashboard = () => {
  const { currentDaySummary, currentDailyStats, loading, fetchStats } =
    useAuth();

  const formatCurrentDailyStatsForChart = (data: CurrentDailyStats[]) => {
    if (!data || !data.length) return [];

    return data
      .map((item) => ({
        date: item.when.substring(5, 10),
        income: Number(item.income),
        litres: Number(item.litres),
        sessions: item.sessions,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && !currentDaySummary && !currentDailyStats.length) {
      fetchStats();
    } 
  }, [fetchStats, currentDaySummary, currentDailyStats]);

  const formatNumber = (num: number | undefined | null) => {
    if (num === undefined || num === null) return "0";
    return new Intl.NumberFormat("ru-RU").format(Number(num));
  };

  const formatCurrency = (num: number | undefined | null) => {
    if (num === undefined || num === null) return "0,00";
    return new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(num));
  };

  const chartData = formatCurrentDailyStatsForChart(currentDailyStats);

  return (
    <div className="p-4 lg:p-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Сеансов за сегодня</p>
              <p className="text-2xl font-bold">
                {loading
                  ? "Loading..."
                  : formatNumber(currentDaySummary?.sessions)}
              </p>
            </div>
            <ShoppingCart className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Литров за сегодня</p>
              <p className="text-2xl font-bold">
                {loading
                  ? "Loading..."
                  : `${formatNumber(Number(currentDaySummary?.litres))} л`}
              </p>
            </div>
            <Droplets className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Доход за сегодня</p>
              <p className="text-2xl font-bold">
                {loading
                  ? "Loading..."
                  : formatCurrency(Number(currentDaySummary?.income))}
              </p>
            </div>
            <FaHryvniaSign size={24} className="text-blue-500" />
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Доход за последние 30 дней
        </h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value) => [formatCurrency(value), "Доход"]}
              />
              <Line
                type="monotone"
                dataKey="income"
                name="Доход"
                stroke="#22c55e"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Small Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            Литров за последние 30 дней
          </h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="litres"
                  name="Литры"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${formatNumber(value)} л`, "Литры"]}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            Сеансов за последние 30 дней
          </h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="sessions"
                  name="Сеансы"
                  stroke="#ec4899"
                  strokeWidth={2}
                />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [formatNumber(value), "Сеансы"]}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Дата
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Сеансы
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Литров
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Доход
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {chartData.length > 0 ? (
              chartData.map((day, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2025-{day.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(day.sessions)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(day.litres)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(day.income)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {loading ? "Loading data..." : "No data available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

// import { Droplets, ShoppingCart } from 'lucide-react'
// import { useEffect } from 'react'
// import { FaHryvniaSign } from 'react-icons/fa6'
// import {
// 	CartesianGrid,
// 	Line,
// 	LineChart,
// 	ResponsiveContainer,
// 	Tooltip,
// 	XAxis,
// 	YAxis,
// } from 'recharts'
// import { CurrentDailyStats } from '../api/Stats/StatsService'
// import { useAuth } from '../helpers/context/AuthContext'

// const Dashboard = () => {
// 	const { currentDaySummary, currentDailyStats, loading, fetchStats } =
// 		useAuth()

// 	const formatCurrentDailyStatsForChart = (data: CurrentDailyStats[]) => {
// 		if (!data || !data.length) return []

// 		const dateObject = data[0]

// 		return Object.entries(dateObject)
// 			.map(([date, values]) => {
// 				const stats = values as {
// 					income: number
// 					litres: number
// 					sessions: number
// 				}
// 				return {
// 					date: date.substring(5), // Обрезаем до формата MM-DD
// 					income: stats.income,
// 					litres: stats.litres,
// 					sessions: stats.sessions,
// 				}
// 			})
// 			.sort((a, b) => {
// 				const dateA = new Date(a.date)
// 				const dateB = new Date(b.date)
// 				return dateA.getTime() - dateB.getTime()
// 			})
// 	}

// 	useEffect(() => {
// 		const token = localStorage.getItem('authToken')
// 		if (token && !currentDaySummary && !currentDailyStats.length) {
// 			fetchStats()
// 		}
// 	}, [fetchStats, currentDaySummary, currentDailyStats])

// 	// Форматируем числа
// 	const formatNumber = (num: number | undefined | null) => {
// 		if (num === undefined || num === null) return '0'
// 		return new Intl.NumberFormat('ru-RU').format(Number(num))
// 	}

// 	const formatCurrency = (num: number | undefined | null) => {
// 		if (num === undefined || num === null) return '0,00'
// 		return new Intl.NumberFormat('ru-RU', {
// 			minimumFractionDigits: 2,
// 			maximumFractionDigits: 2,
// 		}).format(Number(num))
// 	}

// 	const chartData = formatCurrentDailyStatsForChart(currentDailyStats)

// 	return (
// 		<div className='p-4 lg:p-8'>
// 			{/* Stats Cards */}
// 			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
// 				<div className='bg-white rounded-lg shadow p-4'>
// 					<div className='flex items-center justify-between'>
// 						<div>
// 							<p className='text-gray-500'>Сеансов за сегодня</p>
// 							<p className='text-2xl font-bold'>
// 								{currentDaySummary
// 									? formatNumber(currentDaySummary.sessions)
// 									: 'Loading...'}
// 							</p>
// 						</div>
// 						<ShoppingCart className='text-blue-500' size={24} />
// 					</div>
// 				</div>
// 				<div className='bg-white rounded-lg shadow p-4'>
// 					<div className='flex items-center justify-between'>
// 						<div>
// 							<p className='text-gray-500'>Литров за сегодня</p>
// 							<p className='text-2xl font-bold'>
// 								{currentDaySummary
// 									? `${formatNumber(currentDaySummary.litres)} л`
// 									: 'Loading...'}
// 							</p>
// 						</div>
// 						<Droplets className='text-blue-500' size={24} />
// 					</div>
// 				</div>
// 				<div className='bg-white rounded-lg shadow p-4'>
// 					<div className='flex items-center justify-between'>
// 						<div>
// 							<p className='text-gray-500'>Доход за сегодня</p>
// 							<p className='text-2xl font-bold'>
// 								{currentDaySummary
// 									? formatCurrency(currentDaySummary.income)
// 									: 'Loading...'}
// 							</p>
// 						</div>
// 						<FaHryvniaSign size={24} className='text-blue-500' />
// 					</div>
// 				</div>
// 			</div>

// 			{/* Main Chart */}
// 			<div className='bg-white rounded-lg shadow p-4 mb-8'>
// 				<h2 className='text-lg font-semibold mb-4'>
// 					Доход за последние 30 дней
// 				</h2>
// 				<div className='h-[300px]'>
// 					<ResponsiveContainer width='100%' height='100%'>
// 						<LineChart data={chartData}>
// 							<CartesianGrid strokeDasharray='3 3' />
// 							<XAxis dataKey='date' />
// 							<YAxis />
// 							<Tooltip formatter={value => [formatCurrency(value), 'Доход']} />
// 							<Line
// 								type='monotone'
// 								dataKey='income'
// 								name='Доход'
// 								stroke='#22c55e'
// 								strokeWidth={2}
// 							/>
// 						</LineChart>
// 					</ResponsiveContainer>
// 				</div>
// 			</div>

// 			{/* Small Charts */}
// 			<div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
// 				<div className='bg-white rounded-lg shadow p-4'>
// 					<h2 className='text-lg font-semibold mb-4'>
// 						Литров за последние 30 дней
// 					</h2>
// 					<div className='h-[200px]'>
// 						<ResponsiveContainer width='100%' height='100%'>
// 							<LineChart data={chartData}>
// 								<Line
// 									type='monotone'
// 									dataKey='litres'
// 									name='Литры'
// 									stroke='#0ea5e9'
// 									strokeWidth={2}
// 								/>
// 								<XAxis dataKey='date' />
// 								<YAxis />
// 								<Tooltip
// 									formatter={value => [`${formatNumber(value)} л`, 'Литры']}
// 								/>
// 							</LineChart>
// 						</ResponsiveContainer>
// 					</div>
// 				</div>
// 				<div className='bg-white rounded-lg shadow p-4'>
// 					<h2 className='text-lg font-semibold mb-4'>
// 						Сеансов за последние 30 дней
// 					</h2>
// 					<div className='h-[200px]'>
// 						<ResponsiveContainer width='100%' height='100%'>
// 							<LineChart data={chartData}>
// 								<Line
// 									type='monotone'
// 									dataKey='sessions'
// 									name='Сеансы'
// 									stroke='#ec4899'
// 									strokeWidth={2}
// 								/>
// 								<XAxis dataKey='date' />
// 								<YAxis />
// 								<Tooltip formatter={value => [formatNumber(value), 'Сеансы']} />
// 							</LineChart>
// 						</ResponsiveContainer>
// 					</div>
// 				</div>
// 			</div>

// 			{/* Data Table */}
// 			<div className='bg-white rounded-lg shadow overflow-hidden'>
// 				<table className='min-w-full'>
// 					<thead className='bg-gray-50'>
// 						<tr>
// 							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
// 								Дата
// 							</th>
// 							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
// 								Сеансы
// 							</th>
// 							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
// 								Литров
// 							</th>
// 							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
// 								Доход
// 							</th>
// 						</tr>
// 					</thead>
// 					<tbody className='divide-y divide-gray-200'>
// 						{chartData.length > 0 ? (
// 							chartData.map((day, index) => (
// 								<tr key={index}>
// 									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
// 										2025-{day.date}
// 									</td>
// 									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
// 										{formatNumber(day.sessions)}
// 									</td>
// 									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
// 										{formatNumber(day.litres)}
// 									</td>
// 									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
// 										{formatCurrency(day.income)}
// 									</td>
// 								</tr>
// 							))
// 						) : (
// 							<tr>
// 								<td
// 									colSpan={4}
// 									className='px-6 py-4 text-center text-sm text-gray-500'
// 								>
// 									{loading ? 'Loading data...' : 'No data available'}
// 								</td>
// 							</tr>
// 						)}
// 					</tbody>
// 				</table>
// 			</div>
// 		</div>
// 	)
// }

// export default Dashboard
