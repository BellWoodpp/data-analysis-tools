// schema.ts 最后加上这段
import { pgTable, bigint, timestamp, index } from 'drizzle-orm/pg-core';

// 验证码冷却表（防刷新、防多设备）
export const verificationCooldown = pgTable(
    'verification_cooldown', 
{
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  userId: bigint('user_id', { mode: 'bigint' }).notNull().unique(), // 一个用户只有一条记录
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(), // 冷却到期时间
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index('verification_cooldown_user_id_idx').on(table.userId),
    expiresAtIdx: index('verification_cooldown_expires_at_idx').on(table.expiresAt),
  };
});