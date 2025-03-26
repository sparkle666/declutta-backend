import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {

/**
   * @index
   * @operationId getUsers
   * @summary This is a sample decription
   * @description Returns array of producs and it's relations
   * @tag Users
   */
    index (context: HttpContext) {

        console.log(context)

        return [
            {
                id: 1,
                username: "six"
            },
            {
                id: 2,
                username: "James"
            }
        ]
    }

    
    show ({params}: { params: { id: number } }) {
        return {id: params.id}
    }
}