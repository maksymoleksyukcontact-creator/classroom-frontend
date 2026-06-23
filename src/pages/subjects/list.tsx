import { CreateButton } from '@/components/refine-ui/buttons/create'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { ListView } from '@/components/refine-ui/views/list-view'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DEPARTMENTS_OPTIONS } from '@/constants'
import { Subject } from '@/types'
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from '@tanstack/react-table'
import { Badge, SearchIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

const SubjectsList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState("all");

    const departmentFilter = selectedDepartment === "all" ? [] : [
        { field: 'department', operator: 'eq' as const, value: selectedDepartment }]
    const searchFilters = searchQuery ? [{
        field: 'name', operator: 'contains' as const, value: searchQuery
    }] : [];


    const subjectTable = useTable<Subject>({
        columns: useMemo<ColumnDef<Subject>[]>(
            () => [
                {
                    id: 'code',
                    accessorKey: 'code',
                    size: 100,
                    header: () => <p>Code</p>,
                    cell: ({ getValue }) => <span className='bg-primary p-2 rounded-2xl'>{getValue<string>()}</span>
                },
                {
                    id: 'name',
                    accessorKey: 'name',
                    size: 200,
                    header: () => <p>Name</p>,
                    cell: ({ getValue }) => <p>{getValue<string>()}</p>
                },
                {
                    id: 'department',
                    accessorKey: 'department',
                    size: 150,
                    header: () => <p>Department</p>,
                    cell: ({ getValue }) => <p>{getValue<string>()}</p>
                },
                {
                    id: 'description',
                    accessorKey: 'description',
                    size: 300,
                    header: () => <p>Description</p>,
                    cell: ({ getValue }) => <p>{getValue<string>()}</p>
                }
            ], []),
        refineCoreProps: {
            resource: "subjects",
            pagination: { pageSize: 10, mode: 'server' },
            filters: { permanent: [...departmentFilter, ...searchFilters] },
            sorters: {
                initial: [{ field: "id", order: "desc" as const }]
            },
        }
    });



    return (
        <ListView>
            <Breadcrumb />
            <h1>Subjects</h1>
            <div className='intro-row'>
                <p>Quick access to essential metrics and management tools.</p>
                <div className='actions-row'>
                    <div className="search-field">
                        <SearchIcon className='search-icon' />
                        <Input className="pl-10 w-full" placeholder="Search by name" type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by Department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                {DEPARTMENTS_OPTIONS.map((dept) => (
                                    <SelectItem value={dept.value} key={dept.value}>{dept.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <CreateButton />
                    </div>
                </div>
            </div>
            <DataTable table={subjectTable} />
        </ListView>
    )
}

export default SubjectsList