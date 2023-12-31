import { Box, Icon } from '@chakra-ui/react'
import { Chart } from '../../../components/Chart'
import { ChartContent } from '../../../components/ChartContent/ChartContent'
import {
  ChartItems,
  ChartItemsProperty,
} from '../../../components/ChartItems/ChartItems'
import { useEffect, useState } from 'react'
import { api } from '../../../service/apiClient'
import { useAppToast } from '../../../hooks/useAppToast'
import { EmptyState } from '../../../components/EmptyState'
import { RxPerson } from 'react-icons/rx'
import { Loading } from '../../../components/Loading'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../../components/Pagination'

type GetEmployeePropsResponse = {
  restaurantManagers: [
    {
      id: string
      name: string
      username: string
      restaurantId: string
      isOwner: boolean
      createdAt: Date
    },
  ]
  matchCount: number
  numberOfPages: number
}

type EmployeeProps = {
  id: string
  name: string
  username: string
  restaurantId: string
  isOwner: boolean
  createdAt: Date
}

const chartProperty: ChartItemsProperty<EmployeeProps> = {
  name: { label: 'Colaboradores', format: 'text' },
  createdAt: { label: 'Data de criação', format: 'date' },
}

export function Employee() {
  const navigate = useNavigate()
  const { handleRequestError, handleRequestSuccess } = useAppToast()
  const [employee, setEmployee] = useState<EmployeeProps[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalItens, setTotalItens] = useState<number>(1)

  async function getAllEmployee() {
    setLoadingEmployees(true)
    try {
      const response = await api.get<GetEmployeePropsResponse>(
        `/restaurant-manager?page=${currentPage}`,
      )

      const employees: EmployeeProps[] = response.data.restaurantManagers
      setTotalItens(response.data.matchCount)
      setEmployee(employees)
    } catch (error) {
      handleRequestError(error)
    } finally {
      setLoadingEmployees(false)
    }
  }

  const handleRemoveEmployee = async (restaurantManagerId: string) => {
    try {
      const response = await api.delete(
        `/restaurant-manager/${restaurantManagerId}`,
      )

      if (response.status === 204) {
        handleRequestSuccess('Colaborador removido com sucesso!')
        getAllEmployee()
      }
    } catch (error) {
      handleRequestError(error)
    }
  }
  const handleOpenUpdateEmployee = (employee: EmployeeProps) => {
    navigate('/restaurant/employee/update', { state: { employee } })
  }
  useEffect(() => {
    getAllEmployee()
  }, [currentPage])

  return (
    <Box w="100%">
      <Chart headingTitle="Colaboradores" href="/restaurant/employee/create">
        {loadingEmployees ? (
          <Loading />
        ) : employee.length === 0 ? (
          <EmptyState
            title="Você não possui Colaboradores criados para listagem..."
            icon={
              <Icon
                as={RxPerson}
                boxSize={20}
                color="gray.300"
                marginBottom={5}
              />
            }
          />
        ) : (
          <ChartContent headers={chartProperty}>
            {employee.map((employee, employeeIndex) => {
              return (
                <ChartItems
                  values={chartProperty}
                  data={employee}
                  key={employeeIndex}
                  onRemove={() => handleRemoveEmployee(employee.id)}
                  onEdit={() => handleOpenUpdateEmployee(employee)}
                />
              )
            })}
          </ChartContent>
        )}
        <Pagination
          currentPage={currentPage}
          totalCountOfRegisters={totalItens}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </Chart>
    </Box>
  )
}
