import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Patch,
  Delete,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { InvoiceService } from "./invoice.service";
import { invoiceData } from "../interface";

@Controller("invoice")
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get("getAccount")
  getAccount() {
    return this.invoiceService.getAccount();
  }

  @Post("pay")
  pay(@Body() data: { id: string }) {
    return this.invoiceService.pay(data.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("create")
  create(@Body() data: invoiceData) {
    return this.invoiceService.create(data);
  }

  @Get("get/:id")
  get(@Param("id") id: string) {
    return this.invoiceService.get(id);
  }

  @Post("payed")
  payed(
    @Body()
    data: {
      id: string;
      paider_name: string;
      paider_email: string;
      fee_status: boolean;
      paid_date: string;
    }
  ) {
    return this.invoiceService.payed(data);
  }

  @Post("paymentSecret")
  paymentSecret(@Body() data: { id: string; email: string }) {
    return this.invoiceService.paymentSecret(data);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get("getInvoiceNum/:company_id")
  getInvoiceNum(@Param("company_id") company_id: number) {
    return this.invoiceService.getInvoiceNum(company_id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("getAll/:company_id")
  getAll(
    @Param("company_id") company_id: string,
    @Body() data: { limit: number; page: number }
  ) {
    return this.invoiceService.getAll(company_id, data);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("getInvoiceByCompany/:company_id")
  getInvoiceByCompany(
    @Param("company_id") company_id: string,
    @Body() data: { limit: number; page: number }
  ) {
    return this.invoiceService.getInvoiceByCompany(company_id, data);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get("getByProject/:project_id")
  getByProject(@Param("project_id") project_id: string) {
    return this.invoiceService.getByProject(project_id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("update/:id")
  update(@Param("id") id: number, @Body() data: invoiceData) {
    return this.invoiceService.update(id, data);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("remove/:id")
  remove(@Param("id") id: number) {
    return this.invoiceService.remove(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("sendInvoice")
  sendInvoice(@Body() data: any) {
    return this.invoiceService.sendInvoice(data);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("createSubscription")
  createSubscription(
    @Body() data: { paymentMethod: string; name: string; email: string }
  ) {
    return this.invoiceService.createSubscription(data);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("cancelSubscription")
  cancelSubscription(@Body() data: { subscriptionId: string }) {
    return this.invoiceService.cancelSubscription(data.subscriptionId);
  }

}
