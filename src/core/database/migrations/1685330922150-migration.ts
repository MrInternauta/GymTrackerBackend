import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1685330922150 implements MigrationInterface {
  name = 'migration1685330922150';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "routines" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateAt" TIMESTAMP, "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text NOT NULL, "repetitions" jsonb, CONSTRAINT "UQ_2138b731d1e80c16717122f179a" UNIQUE ("name"), CONSTRAINT "PK_6847e8f0f74e65a6f10409dee9f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateAt" TIMESTAMP, "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "role" character varying(100) NOT NULL DEFAULT 'client', "customer_id" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_d72eb2a5bbff4f2533a5d4caff" UNIQUE ("customer_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "customer" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateAt" TIMESTAMP, "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "lastName" character varying(255) NOT NULL, "phone" character varying(255) NOT NULL, CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "muscles" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateAt" TIMESTAMP, "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text NOT NULL, "link" text NOT NULL, "image1" character varying NOT NULL, "image2" character varying NOT NULL, "image3" character varying NOT NULL, CONSTRAINT "UQ_045c55b12f366cadd2ad0e363fc" UNIQUE ("name"), CONSTRAINT "PK_d447d24f0750ae71b1ec5ae9668" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "exercises" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateAt" TIMESTAMP, "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text NOT NULL, "link" text NOT NULL, "image1" character varying NOT NULL, "image2" character varying NOT NULL, "image3" character varying NOT NULL, "equipment_id" integer, CONSTRAINT "UQ_a521b5cac5648eedc036e17d1bd" UNIQUE ("name"), CONSTRAINT "PK_c4c46f5fa89a58ba7c2d894e3c3" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "equipments" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateAt" TIMESTAMP, "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text NOT NULL, "link" text NOT NULL, "image1" character varying NOT NULL, "image2" character varying NOT NULL, "image3" character varying NOT NULL, CONSTRAINT "UQ_f4998754e0540f11071135fac36" UNIQUE ("name"), CONSTRAINT "PK_250348d5d9ae4946bcd634f3e61" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "routines_user" ("routine_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_791eb875e1be644ca884b4fd147" PRIMARY KEY ("routine_id", "user_id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_90853d490e0e83cddc20382eda" ON "routines_user" ("routine_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_6f1e74a7a2d9d4b4d61924d373" ON "routines_user" ("user_id") `);
    await queryRunner.query(
      `CREATE TABLE "exercise_muscle" ("muscle_id" integer NOT NULL, "exercise_id" integer NOT NULL, CONSTRAINT "PK_8fe9b75e600e1b0f6f99f742659" PRIMARY KEY ("muscle_id", "exercise_id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_ec5ee68a7c28617935fbe41d7a" ON "exercise_muscle" ("muscle_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_6dffb224b9d5d82c92b32d763d" ON "exercise_muscle" ("exercise_id") `);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_d72eb2a5bbff4f2533a5d4caff9" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "exercises" ADD CONSTRAINT "FK_2bb208f4a02f1b077c67352fc11" FOREIGN KEY ("equipment_id") REFERENCES "equipments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "routines_user" ADD CONSTRAINT "FK_90853d490e0e83cddc20382eda2" FOREIGN KEY ("routine_id") REFERENCES "routines"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "routines_user" ADD CONSTRAINT "FK_6f1e74a7a2d9d4b4d61924d3735" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "exercise_muscle" ADD CONSTRAINT "FK_ec5ee68a7c28617935fbe41d7ad" FOREIGN KEY ("muscle_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "exercise_muscle" ADD CONSTRAINT "FK_6dffb224b9d5d82c92b32d763d6" FOREIGN KEY ("exercise_id") REFERENCES "muscles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "exercise_muscle" DROP CONSTRAINT "FK_6dffb224b9d5d82c92b32d763d6"`);
    await queryRunner.query(`ALTER TABLE "exercise_muscle" DROP CONSTRAINT "FK_ec5ee68a7c28617935fbe41d7ad"`);
    await queryRunner.query(`ALTER TABLE "routines_user" DROP CONSTRAINT "FK_6f1e74a7a2d9d4b4d61924d3735"`);
    await queryRunner.query(`ALTER TABLE "routines_user" DROP CONSTRAINT "FK_90853d490e0e83cddc20382eda2"`);
    await queryRunner.query(`ALTER TABLE "exercises" DROP CONSTRAINT "FK_2bb208f4a02f1b077c67352fc11"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_d72eb2a5bbff4f2533a5d4caff9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6dffb224b9d5d82c92b32d763d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ec5ee68a7c28617935fbe41d7a"`);
    await queryRunner.query(`DROP TABLE "exercise_muscle"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6f1e74a7a2d9d4b4d61924d373"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_90853d490e0e83cddc20382eda"`);
    await queryRunner.query(`DROP TABLE "routines_user"`);
    await queryRunner.query(`DROP TABLE "equipments"`);
    await queryRunner.query(`DROP TABLE "exercises"`);
    await queryRunner.query(`DROP TABLE "muscles"`);
    await queryRunner.query(`DROP TABLE "customer"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "routines"`);
  }
}
