import { NextResponse, NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid';

export function middleware(request: NextRequest) {
	const pathName = request.nextUrl.pathname
	switch (pathName) {
		case '/table':
		case '/game':
			const id = uuidv4()
			const newURL = new URL(request.nextUrl)
			newURL.pathname = `${pathName}/${id}`
			return NextResponse.redirect(newURL)
	}

}

export const config = {
	matcher: [
		'/table',
		'/game'
	],
}