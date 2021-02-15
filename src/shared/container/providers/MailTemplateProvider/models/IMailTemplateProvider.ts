import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO'

export default interface IMailTempalteProvider {
    parse(data: IParseMailTemplateDTO): Promise<string>
}
