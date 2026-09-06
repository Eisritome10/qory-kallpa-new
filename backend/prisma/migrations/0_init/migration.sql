-- CreateEnum
CREATE TYPE "Role" AS ENUM ('POSTULANTE', 'DIRECTOR_GENERAL', 'DIRECTOR_ALIANZAS_RECAUDACION', 'DIRECTOR_TECNOLOGIA_SISTEMAS', 'DIRECTOR_SUPERVISION_PROYECTOS', 'DIRECTOR_PROGRAMAS', 'DIRECTOR_EVENTOS', 'DIRECTOR_MARKETING', 'DIRECTOR_GESTION_HUMANA');

-- CreateEnum
CREATE TYPE "AreaVoluntariado" AS ENUM ('ALIANZAS_RECAUDACION', 'TECNOLOGIA_SISTEMAS', 'SUPERVISION_PROYECTOS', 'PROGRAMAS', 'EVENTOS', 'MARKETING', 'GESTION_HUMANA');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDIENTE', 'EN_REVISION', 'ACEPTADO', 'RECHAZADO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'POSTULANTE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "area" "AreaVoluntariado" NOT NULL,
    "motivation" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "cvUrl" TEXT NOT NULL,
    "cvFileName" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDIENTE',
    "feedback" TEXT,
    "postulanteId" TEXT NOT NULL,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sus_evaluations" (
    "id" TEXT NOT NULL,
    "respondentName" TEXT,
    "applicationId" TEXT,
    "q1" INTEGER NOT NULL,
    "q2" INTEGER NOT NULL,
    "q3" INTEGER NOT NULL,
    "q4" INTEGER NOT NULL,
    "q5" INTEGER NOT NULL,
    "q6" INTEGER NOT NULL,
    "q7" INTEGER NOT NULL,
    "q8" INTEGER NOT NULL,
    "q9" INTEGER NOT NULL,
    "q10" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "evaluatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sus_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "applications_area_idx" ON "applications"("area");

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_postulanteId_fkey" FOREIGN KEY ("postulanteId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sus_evaluations" ADD CONSTRAINT "sus_evaluations_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sus_evaluations" ADD CONSTRAINT "sus_evaluations_evaluatedById_fkey" FOREIGN KEY ("evaluatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

