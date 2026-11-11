import { PAGE } from '@/constants/pageUri'
import Candidate from '@/pages/Candidate'
import Dashboard from '@/pages/Dashboard'
import { Navigate, Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={PAGE.DEFAULT} element={<Navigate to={PAGE.DASHBOARD} />} />
      <Route path={PAGE.DASHBOARD} element={<Dashboard />} />
      <Route path={`${PAGE.CANDIDATE}/:id/:role`} element={<Candidate />} />
    </Routes>
  )
}

export default AppRoutes
