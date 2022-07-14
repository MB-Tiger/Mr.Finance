import React, { useState, useEffect } from "react";
import useTitle from "../hooks/useTitle";
import Chart from "react-apexcharts";
import { gql, useQuery } from "@apollo/client";

const MY_EXPENSES = gql`
  query GetMyExpenses {
    getMyExpenses {
      _id
      amount
      date
      tags {
        _id
        name
        color
      }
    }
  }
`;

const DashboardHome = () => {
  useTitle("Dashboard");
  const { loading, error, data } = useQuery(MY_EXPENSES);
  const [optionsMixedChart, setOptionsMixedChart] = useState({});
  const [seriesMixedChart, setSeriesMixedChart] = useState([]);
  const [optionsBar, setOptionsBar] = useState({});
  const [seriesBar, setSeriesBar] = useState([]);
  const dataAmount = data?.getMyExpenses.map((myExpense) => myExpense.amount);
  const dataTag = data?.getMyExpenses.map((myExpense) => {
    return {
      name: myExpense.tags[0].name,
      data: [myExpense.amount],
    };
  });

  console.log(data);
  console.log(dataTag);
  console.log(
    data?.getMyExpenses.map((myExpense) => myExpense.date.substring(0, 10))
  );

  useEffect(() => {
    setOptionsMixedChart({
      chart: {
        id: "basic-bar",
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
        },
      },
      stroke: {
        width: [4, 0, 0],
      },
      xaxis: {
        categories: data?.getMyExpenses.map((myExpense) => {
          const date = new Date(myExpense.date);
          return [
            `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`,
          ];
        }),
      },
      markers: {
        size: 6,
        strokeWidth: 3,
        fillOpacity: 0,
        strokeOpacity: 0,
        hover: {
          size: 8,
        },
      },
      yaxis: {
        tickAmount: 5,
        min: 0,
        max: 1000,
      },
    });
    setSeriesMixedChart([
      {
        name: "expense-1",
        type: "line",
        data: dataAmount,
      },
      {
        name: "expense-2",
        type: "column",
        data: dataAmount,
      },
      {
        name: "expense-3",
        type: "column",
        data: dataAmount,
      },
    ]);
    setOptionsBar({
      chart: {
        stacked: true,
        stackType: "100%",
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        dropShadow: {
          enabled: true,
        },
      },
      stroke: {
        width: 0,
      },
      xaxis: {
        categories: ["Fav Tag"],
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      fill: {
        opacity: 1,
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          shadeIntensity: 0.35,
          gradientToColors: undefined,
          inverseColors: false,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [90, 0, 100],
        },
      },

      legend: {
        position: "bottom",
        horizontalAlign: "right",
      },
    });
    setSeriesBar(dataTag ? dataTag : []);
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="animate-spin w-16 h-16 m-16 rounded-full border-[10px] border-transparent border-b-[10px] border-b-red-800 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    console.log(error);
    return (
      <div className="w-full min-h-screen">
        <div className="text-xl font-semibold">Error!</div>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-gray-50 text py-8">
      <div className="container">
        <h2 className="lg:w-[650px] w-full mx-auto">
          <p className="md:text-3xl text-2xl font-bold mb-6">Dashboard</p>
        </h2>
        <div className="lg:w-[650px] w-full bg-white rounded-lg shadow mx-auto p-4">
          <p className="text-lg font-medium text-blue-900">Orders chart</p>
          <hr className="my-4" />
          <Chart
            type="line"
            width="100%"
            height={300}
            series={seriesMixedChart}
            options={optionsMixedChart}
          />
        </div>
        <div className="lg:w-[650px] w-full bg-white rounded-lg shadow mt-8 p-4 mx-auto">
          <p className="text-lg font-medium text-blue-900">Tags chart</p>
          <Chart
            type="bar"
            width="100%"
            height={140}
            series={seriesBar}
            options={optionsBar}
          />
        </div>
      </div>
    </main>
  );
};

export default DashboardHome;
