import { left, right, type Either } from "@/core/either";

import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { adminRepository } from "@/domain/aplication/repository/admin-repository";
import type { groupRepository } from "@/domain/aplication/repository/group-repository";
import type { modelRepository } from "@/domain/aplication/repository/model-repository";
import type { Group } from "@/domain/enterprise/group";

interface GetGroupRequest {
  Id: string; //Id from jwt
}

type GetGroupResponse = Either<
  ResourceNotFoundError,
  { group: Group[] }
>;
export class GetGroupUseCase {
  constructor(
    public groupRepository: groupRepository,
    public adminRepository: adminRepository,
    public modelRepository: modelRepository,
  ) {}
  async execute({ Id }: GetGroupRequest): Promise<GetGroupResponse> {
    const admin = await this.adminRepository.findById(Id);

    if (!admin) {
      return left(new ResourceNotFoundError(Id));
    }

    const model = await this.modelRepository.findByAdminId(admin.id.toString());

    if (!model) {
      return left(new ResourceNotFoundError("não há modelos"));
    }

    const group = await this.groupRepository.findManyByModelId(
      model.id.toString(),
    );

    if (!group) {
      return left(new ResourceNotFoundError(model.id.toString()));
    }

    return right({ group });
  }
}
