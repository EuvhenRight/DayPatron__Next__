// Define the types for each block
interface AboutFirstBlock {
	text: string
}

interface AboutImageBlock {
	image: string
	titleH1?: string
	title: string
}

interface AboutSecondBlock {
	textSecond: string
}

// Define the overall structure
interface ContentAboutPage {
	AboutFirstBlock: AboutFirstBlock
	AboutImageBlock: AboutImageBlock
	AboutSecondBlock: AboutSecondBlock
}

// Define the main content structure
export interface ContentData {
	title?: string
	aboutUs?: { description: string; middleText: string; endText: string }
	'2022': ContentAboutPage
	'2023': ContentAboutPage
	'2024': ContentAboutPage
}
