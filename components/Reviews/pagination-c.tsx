import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'

interface Props {
	pageTotal: number
	setPage: React.Dispatch<React.SetStateAction<number>>
	page: number
}

export const PaginationC = ({ setPage, page, pageTotal }: Props) => {
	// LOGIC FOR PAGINATION PAGES
	const handlePageChange = (newPage: number) => {
		if (newPage < 1) {
			return setPage(1)
		} else if (newPage > pageTotal) {
			return setPage(pageTotal)
		}
		setPage(newPage)
	}
	return (
		<Pagination>
			<PaginationContent className='*:cursor-pointer'>
				<PaginationItem>
					{/* CONDITION isActive={page > 1} */}
					<PaginationPrevious onClick={() => handlePageChange(page - 1)} />
				</PaginationItem>
				<PaginationItem>
					{/* CONDITION isActive */}
					<PaginationLink isActive>{page}</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationEllipsis />
				</PaginationItem>
				<PaginationItem>
					<PaginationLink onClick={() => handlePageChange(pageTotal)}>
						{pageTotal}
					</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationNext onClick={() => handlePageChange(page + 1)} />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	)
}
