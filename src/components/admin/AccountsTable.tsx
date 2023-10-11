const AccountsTable = (props: {accountList: any[], setSelectedStartOfWeek: any}) => {
  const usernames: string[] = [];

  return (
    <div className="flex flex-col justify-items-center items-center h-screen">
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
            props.accountList?.map((account, index) => {
              const weeklyFigure = account.weeklyFigures.length > 0 ? account.weeklyFigures[0].amount : 0;
              const elements: React.ReactElement[] = [];
              if (!usernames.includes(account.user.username)) {
                elements.push(<tr key={"separator"}><td colSpan={7} className="px-6 bg-gray-400 text-gray-100">{account.user.username}</td></tr>)
                usernames.push(account.user.username)
              }
              elements.push(
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-no-wrap text-gray-500">{account.website}</td>
                  <td className="px-6 py-4 whitespace-no-wrap text-gray-500">{account.username}</td>
                  <td className="px-6 py-4 whitespace-no-wrap text-gray-500">{account.password}</td>
                  <td className="px-6 py-4 whitespace-no-wrap text-gray-500">{account.ip_location}</td>
                  <td className="px-6 py-4 whitespace-no-wrap text-gray-500">{account.credit_line}</td>
                  <td className="px-6 py-4 whitespace-no-wrap text-gray-500">{account.max_win}</td>
                  <td className="px-6 py-4 whitespace-no-wrap text-gray-500">
                    <div className="flex flex-row justify-between">
                      {weeklyFigure}
                      <button className="bg-blue-500 hover:bg-blue-600 text-gray-100 rounded px-2">Update</button>
                    </div>
                  </td>
                </tr>
              )
            return elements;
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default AccountsTable