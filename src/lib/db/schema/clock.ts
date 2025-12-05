// schema.ts 最后加上这段
import { pgTable, bigint, timestamp, index } from 'drizzle-orm/pg-core';

// 验证码冷却表（防刷新、防多设备）
export const verificationCooldown = pgTable(
    'verification_cooldown', 
  { 
    // “给我一个 64 位大整数作为主键，由数据库自动递增生成，永远别让我手动插值，谢谢！”
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    userId: bigint('user_id', { mode: 'bigint' }).notNull().unique(), // 一个用户只有一条记录
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(), // 冷却到期时间
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  }, 
);
