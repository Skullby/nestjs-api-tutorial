import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(private prisma:PrismaService) {}
    
    getBookmarks(userId:number) {
        return this.prisma.bookmark.findMany({
            where: {
                userId
            },
        });
    }

    getBookmarkById(userId:number, bookmarkId: number) {}

    createBookmark(userId:number, dto:CreateBookmarkDto) {}

    editBookmarkById(userId:number, bookmarkId: number, dto: EditBookmarkDto) {}

    deleteBookmarkById(userId: number, bookmarkId: number) {}

}
