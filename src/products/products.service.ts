import {
    Injectable,
    Logger,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger(ProductsService.name);

    onModuleInit() {
        this.$connect();
        this.logger.log('Base de datos connect');
    }
    create(createProductDto: CreateProductDto) {
        return this.product.create({ data: createProductDto });
    }

    async findAll(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        const totalPage = await this.product.count({
            where: { available: true },
        });

        const lastPage = Math.ceil(totalPage / limit);

        const data = await this.product.findMany({
            where: { available: true },
            take: limit,
            skip: (page - 1) * limit,
        });

        return { data, meta: { page, total: totalPage, lastPage } };
    }

    async findOne(id: number) {
        const product = await this.product.findFirst({
            where: { id, available: true },
        });

        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }

        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        const { id: _, ...data } = updateProductDto;

        await this.findOne(id);

        return this.product.update({ where: { id }, data });
    }

    async remove(id: number) {
        await this.findOne(id);

        return this.product.update({
            where: { id },
            data: { available: false },
        });
    }
}
