import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";

const AgentsTable = (props: {baseUrl: string}) => {
  const [agentList, setAgentList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true)
    fetch(props.baseUrl + "/api/agents/all", {
        method: "GET"
      })
      .then((response) => response.json())
      .then((data) => {
        setAgentList(data);
        setIsLoading(false)
      })
  },[])

  const TableRows = () => {
    return(
      <>
        {
          agentList?.map((agent, index) => 
            <tr key={index} className="bg-white">
              <td className={`px-6 py-4 whitespace-no-wrap text-gray-500 ${index === agentList.length-1 && "rounded-bl"}`}>{agent.name}</td>
              <td className="px-6 py-4 whitespace-no-wrap text-gray-500">{agent.username}</td>
              <td className="px-6 py-4 whitespace-no-wrap text-gray-500">{agent.role}</td>
              <td className={`px-6 py-4 whitespace-no-wrap text-gray-500 ${index === agentList.length-1 && "rounded-br"}`}>{agent.risk_percentage}%</td>
            </tr>
          )
        }
      </>
    )
  }
  return (
    <div className="flex flex-col sm:justify-items-center sm:items-center">
      <table className="mt-4 table-auto">
        <thead className="text-gray-100">
          <tr>
            <th className="px-6 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider rounded-tl">
              Name
            </th>
            <th className="px-6 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider">
              Username
            </th>
            <th className="px-6 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider rounded-tr">
              Risk
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-700 divide-y divide-gray-200">
        {
        isLoading ? (
          <tr>
            <td colSpan={4} className="mx-auto py-3 text-center bg-[17, 23, 41]">
              <Oval
                height={60}
                width={60}
                color="#4287f5"
                wrapperStyle={{display: "flex", "justifyContent": "center"}}
                visible={true}
                ariaLabel='oval-loading'
                secondaryColor="#4d64ab"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            </td>
          </tr>
        ) : (
          <TableRows />
        )
      }
        </tbody>
      </table>
  </div>
  )
}

export default AgentsTable