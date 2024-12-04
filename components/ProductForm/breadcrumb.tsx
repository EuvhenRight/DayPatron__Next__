'use client'
import Link from 'next/link'

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Product } from '@prisma/client'
import { usePathname } from 'next/navigation'

interface Props {
	product?: Product
}
export const BreadcrumbProduct = ({ product }: Props) => {
	const path = usePathname()
	const fixedText = path.substring(1)
	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link href='/'>Home</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link href='/products'>Products</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>{product?.name}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	)
}
