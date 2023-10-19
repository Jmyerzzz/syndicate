import { Oval } from "react-loader-spinner";
import EditUser from "./EditUser";
import AddUser from "./AddUser";

const AgentsTable = (props: {baseUrl: string, agentList: any[], isLoading: boolean, setRefreshKey: any}) => {
  const TableRows = () => {
    return(
      <>
        {
          props.agentList?.map((agent, index) => 
            <tr key={index} className="even:bg-white odd:bg-gray-100">
              <td className="px-3 py-2 whitespace-no-wrap text-gray-500">{index+1}</td>
              <td className="px-3 py-2 whitespace-no-wrap text-gray-500">
                <div className="flex flex-row items-center">
                  <EditUser baseUrl={props.baseUrl} user={agent} setRefreshKey={props.setRefreshKey} />
                  {agent.name}
                </div>
              </td>
              <td className="px-3 py-2 whitespace-no-wrap text-gray-500">{agent.username}</td>
              <td className="px-3 py-2 whitespace-no-wrap text-gray-500">{agent.role}</td>
              <td className="px-3 py-2 whitespace-no-wrap text-gray-500">{agent.risk_percentage}%</td>
              <td className="px-3 py-2 whitespace-no-wrap text-gray-500">{agent.gabe_way}%</td>
              <td className="px-3 py-2 whitespace-no-wrap text-gray-500">{100 - (agent.risk_percentage + (agent.gabe_way || 0))}%</td>
            </tr>
          )
        }
        <tr>
          <td colSpan={7} className="bg-gray-400 hover:bg-gray-500 text-gray-100 rounded-b">
            <AddUser setRefreshKey={props.setRefreshKey} />
          </td>
        </tr>
      </>
    )
  }
  return (
    <div className="flex flex-col 2xl:justify-items-center 2xl:items-center mt-4 overflow-x-auto">
      <table className="table-auto min-w-full">
        <thead className="text-gray-100">
          <tr>
            <th className="px-3 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider rounded-tl">
              #
            </th>
            <th className="px-3 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider">
              Name
            </th>
            <th className="px-3 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider">
              Username
            </th>
            <th className="px-3 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider">
              Role
            </th>
            <th className="px-3 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider">
              Risk
            </th>
            <th className="px-3 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider">
              G Way
            </th>
            <th className="px-3 py-3 bg-gray-700 text-left text-sm font-bold uppercase tracking-wider rounded-tr">
              T Way
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
        {
        props.isLoading ? (
          <tr>
            <td colSpan={7} className="mx-auto py-3 text-center bg-[17, 23, 41]">
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