const { server } = require('typescript')

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: true,
	},
}

module.exports = nextConfig
