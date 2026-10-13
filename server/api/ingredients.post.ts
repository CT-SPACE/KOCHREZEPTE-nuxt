export default defineEventHandler(async (event) => {
    const db = event.context.cloudflare.env.ACHDB
    const body = await readBody<{ name?: string }>(event)
    const name = body?.name?.trim()

    if (!name){
        throw createError({ statusCode: 400, statusMessage: 'Name fehlt' })
    }

    const existing = (await db
        .prepare('SELECT id, name FROM ingredients WHERE LOWER(name) = LOWER(?)')
        .bind(name)
        .first()) as { id: number; name: string } | null

    if (existing){
        return existing
    }

    const result = await db
     .prepare('INSERT INTO ingredients (name) VALUES (?)')
     .bind(name)
     .run()

    return {
        id: result.meta.last_row_id as number,
        name
    }

})
