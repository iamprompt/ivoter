import type { NextPage } from 'next'

const StatisticsPage: NextPage = () => {
  return (
    <>
      <div className="pb-4 text-4xl font-bold">
        <h1>Statistics - []</h1>
      </div>

      <div className="relative overflow-auto rounded-xl border bg-gray-100">
        <div className="overflow-hidden shadow-sm">
          <table className="w-full table-fixed border-collapse text-sm">
            <thead className="border-b border-slate-300">
              <tr className="divide-x divide-slate-200">
                <th className="w-16 p-4 pt-4 pb-3 text-center font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                  No
                </th>
                <th className="p-4 pt-4 pb-3 text-center font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                  Email
                </th>
                <th className="p-4 pt-4 pb-3 text-center font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
                  Vote
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white/90">
              <tr className="divide-x divide-slate-200 hover:bg-gray-200/50">
                <td className="p-4 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  1
                </td>
                <td className="p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  wearedprompt@gmail.com
                </td>
                <td className="p-4 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  AAA
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default StatisticsPage
