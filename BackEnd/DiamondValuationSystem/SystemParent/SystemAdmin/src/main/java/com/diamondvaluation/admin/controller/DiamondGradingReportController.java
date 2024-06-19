package com.diamondvaluation.admin.controller;

import java.io.IOException;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DiamondGradingReportController {
	@GetMapping("/pdf")
    public String getOrderPage(Model model) throws IOException {
        return "DiamondGradingReport";
    }
}
