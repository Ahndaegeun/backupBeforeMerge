package com.kanboo.www.controller.access;

import com.kanboo.www.dto.project.DemandContentDTO;
import com.kanboo.www.service.inter.project.DemandContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor

@RequestMapping("/demand")
public class DemandController {
    private final DemandContentService demandContentService;

    @PostMapping("/postRows")
    public void updateDemandContent(@RequestBody Map<String, List<DemandContentDTO>> map){
        List<DemandContentDTO> params = map.get("params");
        demandContentService.updateDemandContent(params);
    }

    @PostMapping("/load")
    public List<DemandContentDTO> loadDemandContent(@RequestBody Map<String, String> map){
        String mapIdx = map.get("idx");
        Long idx = Long.parseLong(mapIdx);
        List<DemandContentDTO> list = demandContentService.loadDemandContent(idx);
        return list;
    }
    @PostMapping("/deleteRows")
    public void deleteDemandContent(@RequestBody Map<String, List<DemandContentDTO>> map){
        List<DemandContentDTO> params = map.get("params");

        for (DemandContentDTO param : params) {
            if (param.getDemand().getDemandIdx() != null &&
                    param.getDemandCnIdx() != null) {
                Long demandIdxItem = Long.parseLong(String.valueOf(param.getDemand().getDemandIdx()));
                Long demandCnIdxItem = Long.parseLong(String.valueOf(param.getDemandCnIdx()));
                demandContentService.deleteDemandContent(demandIdxItem, demandCnIdxItem);
            }
        }
    }


    @PostMapping("/importDocument")
    public ResponseEntity<?> importDocument(@ModelAttribute MultipartFile[] uploadFile, String demandIdx){
        Long idx = Long.parseLong(demandIdx);
        return demandContentService.importDocument(uploadFile, idx);
    }


    @PostMapping("/downDocument")
    public ResponseEntity<Resource> downloadFile(@RequestBody Map<String, String> map) {

        File f = new File("");
        String absolutePath = f.getAbsolutePath();
        String mapIdx = map.get("idx");
//        String prjctNm = map.get("prjctNm"); // prjctNm vue에서 받아야디ㅗ고 확장자도 받아야한다 균창아
        Long idx = Long.parseLong(mapIdx);
//        String fileName = prjctNm + "-" + idx + ".xlsx";
        Resource resource = demandContentService.downloadExcel(idx);
        //해당 파일이 없을 때
        if (!resource.exists()) {
            System.out.println("파일이 없누");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        String resourceName = resource.getFilename();
        HttpHeaders headers = new HttpHeaders();
        try {
            headers.add("Content-disposition", "attachment;fileName=" +
                    new String(resourceName != null ? resourceName.getBytes(StandardCharsets.UTF_8) : new byte[0],"ISO-8859-1"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(resource, headers, HttpStatus.OK);
    }


}
