import AddAccount from "./AddAccount";
import WeekSelector from "../WeekSelector";

const AgentsAccountsTable = (props: {currentUser: any, userAccountList: any[], setSelectedStartOfWeek: any}) => {
  return (
    <div className="flex flex-col justify-items-center items-center h-screen">
      <div>
        <div className="flex flex-row justify-between content-center px-2">
          <div className="px-3 text-2xl uppercase">Accounts</div>
          <WeekSelector setSelectedStartOfWeek={props.setSelectedStartOfWeek} />
        </div>
        <table className="mt-4 table-auto">
          <thead className="text-gray-100">
            <tr>
              <th className="px-6 py-3 bg-gray-600 text-left text-sm font-bold uppercase tracking-wider">
                Website
              </th>
              <th className="px-6 py-3 bg-gray-600 text-left text-sm font-bold uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 bg-gray-600 text-left text-sm font-bold uppercase tracking-wider">
                Password
              </th>
              <th className="px-6 py-3 bg-gray-600 text-left text-sm font-bold uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-3 bg-gray-600 text-left text-sm font-bold uppercase tracking-wider">
                Credit Line
              </th>
              <th className="px-6 py-3 bg-gray-600 text-left text-sm font-bold uppercase tracking-wider">
                Max Win
              </th>
              <th className="px-6 py-3 bg-gray-600 text-left text-sm font-bold uppercase tracking-wider">
                Weekly Figure
              </th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-500 divide-y divide-gray-200">
            {
              props.userAccountList.map((account, index) => {
                const weeklyFigure = account.weeklyFigures.length > 0 ? account.weeklyFigures[0].amount : 0;
                const elements: React.ReactElement[] = [];
                elements.push(
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-no-wrap">{account.website}</td>
                    <td className="px-6 py-4 whitespace-no-wrap">{account.username}</td>
                    <td className="px-6 py-4 whitespace-no-wrap">{account.password}</td>
                    <td className="px-6 py-4 whitespace-no-wrap">{account.ip_location}</td>
                    <td className="px-6 py-4 whitespace-no-wrap">{account.credit_line}</td>
                    <td className="px-6 py-4 whitespace-no-wrap">{account.max_win}</td>
                    <td className="px-6 py-4 whitespace-no-wrap">{weeklyFigure}</td>
                  </tr>
                )
                return elements
              })
            }
            <tr>
              <td colSpan={7} className="bg-gray-400 hover:bg-gray-500 text-gray-100">
                <AddAccount user={props.currentUser} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AgentsAccountsTable