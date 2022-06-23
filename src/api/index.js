import * as tradeMark from '@/api/product/tradeMark'
import * as attr from '@/api/product/attr'
import * as sku from '@/api/product/sku'
import * as spu from '@/api/product/spu'

//引入权限相关的接口文件 * as 带出所有export 对象
import * as user from './acl/user'
import role from './acl/role'
import permission from './acl/permission'

export default { tradeMark, attr, sku, spu, user, role, permission }
